import classes from './AddressForm.module.css'

export const AddressForm = ({ address, setAddress }) => {

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setAddress(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked
                : value,
        }));
    };

    return (
        <form className={classes.addressForm}>
            <div className={classes.grid}>
                <div className={classes.field}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        name='full_name'
                        placeholder="John Smith"
                        value={address.full_name}
                        onChange={handleChange}
                    />
                </div>

                <div className={classes.field}>
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        name='phone_number'
                        placeholder="+27 71 234 5678"
                        value={address.phone_number}
                        onChange={handleChange}
                    />
                </div>

                <div className={`${classes.field} ${classes.full}`}>
                    <label>Street Address</label>
                    <input
                        type="text"
                        name='street'
                        placeholder="123 Main Street"
                        value={address.street}
                        onChange={handleChange}
                    />
                </div>

                <div className={`${classes.field} ${classes.full}`}>
                    <label>Suburb</label>
                    <input
                        type="text"
                        name='suburb'
                        placeholder="Mowbray"
                        value={address.suburb}
                        onChange={handleChange}
                    />
                </div>

                <div className={classes.field}>
                    <label>City</label>
                    <input
                        type="text"
                        name='city'
                        placeholder="Cape Town"
                        value={address.city}
                        onChange={handleChange}
                    />
                </div>

                <div className={classes.field}>
                    <label>Province</label>

                    <select
                    name='province'
                        value={address.province}
                        onChange={handleChange}
                    >
                        <option value="" disabled>
                            Select Province
                        </option>

                        <option>Eastern Cape</option>
                        <option>Free State</option>
                        <option>Gauteng</option>
                        <option>KwaZulu-Natal</option>
                        <option>Limpopo</option>
                        <option>Mpumalanga</option>
                        <option>North West</option>
                        <option>Northern Cape</option>
                        <option>Western Cape</option>
                    </select>
                </div>

                <div className={classes.field}>
                    <label>Postal Code</label>
                    <input
                        type="text"
                        name='postal_code'
                        placeholder="8001"
                        value={address.postal_code}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <label className={classes.checkbox}>
                <input
                    type="checkbox"
                    name='save_address'
                    checked={address.save_address}
                    onChange={handleChange}
                />
                <span>Save this address for future purchases</span>
            </label>
        </form>
    )
}