import { useState } from "react";
import { HiMiniStar, HiOutlineStar } from "react-icons/hi2";
import classes from "./ReviewForm.module.css";
import { getAccessToken } from "../../../services/auth";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../../../services/api";


export const ReviewForm = (props) => {
    const [rating, setRating] = useState(0);
    const [error, setError] = useState("");
    const [hover, setHover] = useState(0);
    const product = props.product;
    const fetchReviews = props.fetchReviews;
    const [loading, setLoading] = useState(false);


    const [form, setForm] = useState({
        title: "",
        comment: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (rating === 0) {
            setError("Please select a rating.");
            return;
        }

        console.log({
            rating,
            product,
            ...form,
        });

        try {

            if (loading) return;

            setLoading(true);

            const accessToken = getAccessToken();

            await axios.post(
                    `${API_URL}/api/reviews/`,
                    {
                        rating,
                        product,
                        ...form,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
            );
            console.log("success");
            toast.success("Review submitted successfully!");

            // clear the form
            setRating(0);
            setForm({
                title: "",
                comment: "",
            })
            
            fetchReviews();


        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    };


    return (
        <section className={classes.reviewForm}>
            <h2>Add Your Review</h2>

            <form onSubmit={handleSubmit}>
                <div className={classes.field}>
                    <label>Your Rating</label>

                    <div className={classes.stars}>
                        {[1,2,3,4,5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => {
                                    setRating(star);
                                    setError("")
                                }}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                {(hover || rating) >= star
                                    ? <HiMiniStar size={25}/>
                                    : <HiOutlineStar color={"gray"} size={25}/>
                                }
                            </button>
                        ))}
                    </div>
                    {error && (
                        <p className={classes.error}>( {error})</p>
                    )}
                </div>

                <div className={classes.field}>
                    <label>Add Review Title</label>

                    <input
                        type="text"
                        name="title"
                        placeholder="Write Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={classes.field}>
                    <label>Add Detailed Review</label>

                    <textarea
                        rows={8}
                        name="comment"
                        placeholder="Write here"
                        value={form.comment}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    className={classes.submit}
                    type="submit"
                >
                    {loading
                        ? "Loading..."
                        :"Sumbit"
                    }
                </button>
            </form>
        </section>
    );
};