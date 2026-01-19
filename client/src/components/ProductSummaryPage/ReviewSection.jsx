import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/axios";
import { StarRating } from "./StarRating";
import { ReviewCard } from "./ReviewCard";
import { useAuth } from "../../hooks/useAuth"; 

export const ReviewsSection = ({ product }) => {
  const { productId } = useParams();
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEligible, setIsEligible] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!productId) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      setLoading(true);
      const res = await api.get(`/products/${productId}/reviews`, { signal: abortRef.current.signal });
      const reviewList = res.data.reviews || [];
      setReviews(reviewList);

      if (user) {
        const eligibilityRes = await api.get(`/reviews/check-eligibility/${productId}`);
        setIsEligible(eligibilityRes.data.eligible);
        setAlreadyReviewed(eligibilityRes.data.alreadyReviewed);

        if (eligibilityRes.data.alreadyReviewed) {
          const myReview = reviewList.find(r => r.user?._id === user._id);
          if (myReview) {
            setRating(myReview.rating);
            setTitle(myReview.title);
            setComment(myReview.comment);
          }
        }
      }
    } catch (err) {
      if (err.name !== "CanceledError") console.error(err);
    } finally {
      setLoading(false);
    }
  }, [productId, user]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/reviews/upsert/${productId}`, { rating, title, comment });
      alert(alreadyReviewed ? "Review updated!" : "Review submitted!");
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  if (!product) return null;

  return (
    <div className="container mt-5 pb-5">
      <h5 className="mb-4">Ratings & Reviews</h5>

      <div className="row border rounded p-4 mb-4 bg-white g-0">
        <div className="col-md-4 text-center border-end py-2">
          <h1 className="fw-bold m-0">{product.rating}<span className="fs-6">/5</span></h1>
          <StarRating value={product.rating} />
          <div className="text-muted mt-2 small">{product.ratingsCount} Ratings</div>
        </div>

        <div className="col-md-4 d-flex flex-column justify-content-center align-items-center border-end py-2">
          <div className="text-muted mb-2 small">Would you recommend this item?</div>
          <div>
            <button className="btn btn-sm btn-outline-secondary me-2 rounded-0">YES</button>
            <button className="btn btn-sm btn-outline-secondary rounded-0">NO</button>
          </div>
        </div>

        <div className="col-md-4 text-center d-flex flex-column justify-content-center py-2">
          <div className="mb-2 small">Have you used this product?</div>
          <button 
            className="btn btn-danger px-5 rounded-0 fw-bold mx-auto"
            style={{ width: 'fit-content' }}
            disabled={!isEligible}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "CLOSE" : (alreadyReviewed ? "EDIT REVIEW" : "WRITE A REVIEW")}
          </button>
          {!isEligible && user && (
            <div className="text-danger mt-2" style={{ fontSize: '10px' }}>
              Only verified buyers can review
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="border p-4 mb-4 bg-light shadow-sm">
          <h6 className="fw-bold mb-3">{alreadyReviewed ? "Update Your Rating" : "Rate this Product"}</h6>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                    key={star} 
                    className="material-symbols-outlined" 
                    style={{ cursor: 'pointer', color: star <= rating ? '#e40046' : '#ccc', fontSize: '32px' }}
                    onClick={() => setRating(star)}
                >
                  {star <= rating ? 'star' : 'star_outline'}
                </span>
              ))}
            </div>
            <input 
              type="text" 
              className="form-control rounded-0 mb-3" 
              placeholder="Headline" 
              value={title}
              required 
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea 
              className="form-control rounded-0 mb-3" 
              placeholder="Description" 
              value={comment}
              rows="3" 
              required
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button className="btn btn-danger rounded-0 px-5" type="submit" disabled={rating === 0}>
                {alreadyReviewed ? "UPDATE REVIEW" : "SUBMIT REVIEW"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border spinner-border-sm text-danger"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-muted border-top pt-3">No reviews yet.</div>
      ) : (
        reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))
      )}
    </div>
  );
};