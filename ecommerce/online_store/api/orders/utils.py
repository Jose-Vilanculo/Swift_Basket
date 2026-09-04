from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
)


def generate_invoice(order):
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        rightMargin=18,
        leftMargin=18,
        topMargin=18,
        bottomMargin=18,
    )

    styles = getSampleStyleSheet()

    title = styles["Heading1"]
    title.alignment = TA_CENTER

    normal = styles["BodyText"]

    story = []

    # ============================
    # Header
    # ============================

    story.append(Paragraph("<b>SWIFT BASKET</b>", title))
    story.append(Spacer(1, 8))

    story.append(
        Paragraph(
            f"<b>Invoice #:</b> {order.id}<br/>"
            f"<b>Order Date:</b> "
            f"{order.date_created_at.strftime('%d %b %Y')}<br/>"
            f"<b>Estimated Delivery:</b> "
            f"{order.estimated_delivery.strftime('%d %b %Y')}",
            normal,
        )
    )

    story.append(Spacer(1, 14))

    # ============================
    # Shipping details
    # ============================

    story.append(Paragraph("<b>Shipping Details</b>", styles["Heading3"]))

    story.append(
        Paragraph(
            f"""
            {order.shipping_full_name}<br/>
            {order.shipping_phone_number}<br/>
            {order.shipping_street},
            {order.shipping_suburb}<br/>
            {order.shipping_city},
            {order.shipping_province}<br/>
            {order.shipping_postal_code}<br/>
            {order.shipping_country}
            """,
            normal,
        )
    )

    story.append(Spacer(1, 20))

    # ============================
    # Products Table
    # ============================

    data = [
        [
            "Product",
            "Variant",
            "Qty",
            "Price",
        ]
    ]

    for item in order.order_items.select_related(
        "product_variant__product"
    ):
        attributes = ", ".join(
            f"{k}: {v}"
            for k, v in item.product_variant.attributes.items()
        )

        data.append(
            [
                item.product_variant.product.product_name,
                attributes,
                str(item.quantity),
                f"R {item.price}",
            ]
        )

    table = Table(
        data,
        colWidths=[
            70 * mm,
            60 * mm,
            20 * mm,
            30 * mm,
        ],
    )

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.black),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),

                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),

                ("BOTTOMPADDING", (0, 0), (-1, 0), 8),

                ("ALIGN", (2, 1), (3, -1), "CENTER"),

                ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
            ]
        )
    )

    story.append(table)

    story.append(Spacer(1, 20))

    # ============================
    # Totals
    # ============================

    totals = [
        ["Subtotal", f"R {order.total_price}"],
        ["Delivery", f"R {order.delivery_fee}"],
        ["TOTAL", f"R {order.final_price}"],
    ]

    totals_table = Table(
        totals,
        colWidths=[130 * mm, 50 * mm],
    )

    totals_table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (-1, -2), "Helvetica"),
                ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),

                ("LINEABOVE", (0, -1), (-1, -1), 1, colors.black),

                ("ALIGN", (1, 0), (1, -1), "RIGHT"),

                ("BOTTOMPADDING", (0, -1), (-1, -1), 8),
            ]
        )
    )

    story.append(totals_table)

    story.append(Spacer(1, 30))

    story.append(
        Paragraph(
            "<b>Thank you for shopping with Swift Basket!</b>",
            styles["Heading3"],
        )
    )

    doc.build(story)

    buffer.seek(0)

    return buffer