import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { showAlert } from "src/Features/alertsSlice";
import s from "./ProductReviews.module.scss";

const MAX_STARS = 5;

const ProductReviews = ({ productData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const rate = productData?.rate ?? 0;
  const votes = productData?.votes ?? 0;
  const displayVotes = reviews.length > 0 ? votes + reviews.length : votes;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) {
      dispatch(
        showAlert({
          alertText: "Please select a rating (number of stars) before submitting.",
          alertState: "warning",
          alertType: "alert",
        })
      );
      return;
    }

    setReviews((prev) => [
      ...prev,
      {
        rating,
        comment: comment.trim() || null,
        date: new Date().toISOString(),
      },
    ]);
    dispatch(
      showAlert({
        alertText: "Thank you for your review!",
        alertState: "success",
        alertType: "alert",
      })
    );
    setRating(0);
    setComment("");
  };

  return (
    <section className={s.reviewsSection} aria-label="Product reviews">
      <h3 className={s.title}>{t("detailsPage.reviewsTitle")}</h3>
      <p className={s.summary}>
        {t("detailsPage.productRate", { rate })} — {t("detailsPage.reviews", { votes: displayVotes })}
      </p>

      {/* Star selection - user can choose 1-5 stars */}
      <div className={s.starRow}>
        <span className={s.starLabel}>{t("detailsPage.selectStars")}</span>
        <div className={s.stars}>
          {Array.from({ length: MAX_STARS }, (_, i) => {
            const value = i + 1;
            const active = value <= (hoverStar || rating);
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverStar(value)}
                onMouseLeave={() => setHoverStar(0)}
                aria-label={`${value} star`}
                className={s.starBtn}
                data-active={active}
              >
                ★
              </button>
            );
          })}
        </div>
        <span className={s.starHint}>
          {rating ? `${rating} / ${MAX_STARS}` : "—"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className={s.form}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("detailsPage.writeComment")}
          rows={3}
          className={s.textarea}
        />
        <button type="submit" className={s.submitBtn}>
          {t("detailsPage.submitReview")}
        </button>
      </form>

      {/* Comments list */}
      <div className={s.commentsList}>
        <h4 className={s.commentsTitle}>{t("detailsPage.commentsTitle")}</h4>
        {reviews.length === 0 ? (
          <p className={s.noComments}>{t("detailsPage.noCommentsYet")}</p>
        ) : (
          <ul className={s.comments}>
            {reviews.map((r, i) => (
              <li key={i} className={s.commentItem}>
                <div className={s.commentStars}>
                  {Array.from({ length: MAX_STARS }, (_, j) => (
                    <span key={j} className={s.commentStar} data-filled={j < r.rating}>★</span>
                  ))}
                </div>
                {r.comment && <p className={s.commentText}>{r.comment}</p>}
                <time className={s.commentDate}>
                  {new Date(r.date).toLocaleDateString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
