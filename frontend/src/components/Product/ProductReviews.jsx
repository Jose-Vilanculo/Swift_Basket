/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import classes from './ProductReviews.module.css'
import axios from 'axios';
import { HiMiniStar, HiOutlineStar } from 'react-icons/hi2';
import { ReviewForm } from './forms/ReviewForm';
import { getAccessToken } from '../../services/auth';


export const ProductReviews = (props) => {

    const productSlug = props.productSlug;
    const authenticated = props.authenticated;

    const [summary, setSummary] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [nextPage, setNextPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    const fetchReviews = async (page = 1) => {

        const accessToken  = getAccessToken();

        const response = await axios.get(
            `http://127.0.0.1:8000/api/reviews/?slug=${productSlug}&page=${page}`,
            {
                headers: {
                    ...(authenticated && {
                        Authorization: `Bearer ${accessToken}`
                    })
                }
            }
        );

        if (page === 1) {
            setSummary({
                average_rating: response.data.average_rating,
                review_count: response.data.review_count,
                rating_breakdown: response.data.rating_breakdown,
                product: response.data.product_id,
                has_reviewed: response.data.has_reviewed,
            });

            console.log("has reviewed:" + response.data.has_reviewed)

            setReviews(response.data.results);
        } else {
            setReviews(prev => [
                ...prev,
                ...response.data.results,
            ]);
        }

        setHasMore(response.data.next !== null);
        setNextPage(page + 1);
    };

    useEffect(() => {
        fetchReviews();
        console.log(authenticated)
    }, [productSlug]);

    // Reset everything when page loads up
    useEffect(() => {
        setSummary(null);
        setReviews([]);
        setNextPage(1);
        setHasMore(true);

        fetchReviews(1);
    }, [productSlug]);


    if (!summary) {
        return <div>Loading...</div>;
    }

    const ratings = Object.entries(summary.rating_breakdown)
        .reverse()
        .map(([star, count]) => ({
            star,
            count,
        }));

    
    // Resets items to show only the initial 3 reviews
    const showLess = () => {
        setReviews([]);
        setNextPage(1);
        setHasMore(true);

        fetchReviews(1);
    };


    return (
        <section className={classes["reviews-section"]} id="reviews">

            

            {summary.review_count > 0 && (
                
                <>

                {/* Heading */}
                <div className={classes.heading}>
                    <h1>Reviews</h1>
                    <div className={classes.underline}></div>
                </div>

                {/* Overall Summary */}
                <div className={classes["summary-feature"]}>

                    {/* Left side with overall */}
                    <div className={classes.summary}>
                        <div className={classes.overall}>
                            <h2>{summary.average_rating}</h2><p>Out of 5</p>
                            
                        </div>

                        <div className={classes.stars}>
                            <div>
                                {[1, 2, 3, 4, 5].map((star) =>
                                    star <= summary.average_rating ? (
                                        <HiMiniStar key={star} />
                                    ) : (
                                        <HiOutlineStar key={star} color={"gray"}/>
                                    )
                                )}
                            </div>
                        </div>

                        <span className={classes.gray}>({summary.review_count} Reviews)</span>
                    </div>

                    {/* Right side with rating summary */}
                    <div className={classes.reviews}>
                        <div className={classes.breakdown}>
                            {ratings.map((rating) => (
                                <div
                                    key={rating.star}
                                    className={classes.row}
                                >
                                    <span>{rating.star} Star</span>

                                    <div className={classes.track}>
                                        <div
                                            className={classes.fill}
                                            style={{
                                                width: `${(rating.count / summary.review_count) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Review Cards */}
                <div className={classes["review-list"]}>
                    {reviews.map((review, key) =>(
                        <div className={classes.cards} key={key}>

                            <div className={classes.user}>
                                <div className={classes["user-details"]}>
                                    <div className={classes.profile}>
                                        {/* display user's initial if no profile image */}
                                        {review.profile_image
                                            ? <img src={review.profile_image} alt="user's profile image" />
                                            : review.username[0]
                                        }
                                        
                                    </div>
                                    <div className={classes.name}>
                                        <h5>{review.username}</h5>
                                        
                                            {review.is_verified
                                                ? <h6 className={classes.green}>(verified purchase)</h6>
                                                : <h6>(unverified)</h6>
                                            }
                                        
                                    </div>
                                </div>
                                <div className={classes.date}>
                                    {new Date(review.date_created_at).toLocaleDateString("en-GB")}
                                </div>
                            </div>

                            <h4>{review.title}</h4>
                            <p>{review.comment}</p>
                            <div className={classes["rating-row"]}>
                                <div className={classes.stars}>
                                    {[1, 2, 3, 4, 5].map((star) =>
                                        star <= review.rating ? (
                                            <HiMiniStar key={star} />
                                        ) : (
                                            <HiOutlineStar key={star} color={"gray"}/>
                                        )
                                    )}
                                    
                                </div>
                                <p>{review.rating}</p>
                            </div>
                        </div>
                    ))}

                    {/* Show more button */}
                    <div className={classes.buttons}>
                        {hasMore && (
                            <button onClick={() => fetchReviews(nextPage)}>
                                Load More...
                            </button>
                        )}

                        {!hasMore && reviews.length > 3 && (
                            <button onClick={showLess}>
                                Show Less
                            </button>
                        )}
                    </div>

                </div>

                </>

            )}

            {/* Review form for authenticated users who havent reviewed the product yet*/}
            {authenticated && !summary.has_reviewed && (
                <>
                {summary.review_count == 0 && (
                    <div className={classes["no-reviews"]}>
                        <h3>No reviews yet</h3>
                        <div className={classes.underline}></div>
                    </div>
                )}
                <ReviewForm product={summary.product} fetchReviews={fetchReviews} />
                </>
            )}

            {/* {summary.review_count == 0 && (
                <div className={classes.white}></div>
            )} */}
            
        </section>
    )
}