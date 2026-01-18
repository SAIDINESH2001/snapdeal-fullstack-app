import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/axios";
import { StarRating } from "./StarRating";
import { ReviewCard } from "./ReviewCard";

export const ReviewsSection = ({ product }) => {
  const { productId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const abortRef = useRef(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      setLoading(true);

      const res = await api.get(
        `/products/${productId}/reviews`,
        { signal: abortRef.current.signal }
      );

      setReviews(res.data.reviews || []);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
    return () => abortRef.current?.abort();
  }, [fetchReviews]);

  if (!product) return null;

  return (
    <div className="container mt-5">
      <h5 className="mb-4" id="ratingsSection">Ratings & Reviews</h5>

      <div className="row border rounded p-4 mb-4">
        <div className="col-md-4 text-center border-end">
          <h1 className="fw-bold">
            {product.rating}
            <span className="fs-6">/5</span>
          </h1>
          <StarRating value={product.rating} />
          <div className="text-muted mt-2">
            {product.ratingsCount} Ratings
          </div>
        </div>

        <div className="col-md-4 d-flex flex-column justify-content-center align-items-center border-end">
          <div className="text-muted mb-2">
            Would you recommend this item?
          </div>
          <div>
            <button className="btn btn-outline-secondary me-2">YES</button>
            <button className="btn btn-outline-secondary">NO</button>
          </div>
        </div>

        <div className="col-md-4 text-center d-flex flex-column justify-content-center">
          <div className="mb-2">Have you used this product?</div>
          <button className="btn btn-danger px-5">REVIEW</button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="text-muted">No reviews yet.</div>
      ) : (
        reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))
      )}
    </div>
  );
};
