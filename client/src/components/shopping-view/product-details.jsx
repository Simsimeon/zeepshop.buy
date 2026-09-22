import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItem } from "@/store/shop/cart-slice";
import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from "@/store/shop/review-slice";
import ProductRating from "./rating";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/toast";
import { useRequireAuth } from "../common/use-require-auth";
import { ReviewListSkeleton } from "../common/skeletons";
import { LazyImage } from "../common/lazy-image";
import { useEffect, useState } from "react";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
 const dispatch = useDispatch();
 const {user}=useSelector((state)=>state.auth);
 const promptSignIn = useRequireAuth();
 const { reviews, isLoading: isReviewsLoading, error: reviewsError } = useSelector((state)=>state.review);
 const [comment ,setComment]=useState("")
 const [title ,setTitle]=useState("")
 const [starValue, setStarValue] = useState(0);
 const [ratingResetKey, setRatingResetKey] = useState(0);
 const [editingReviewId, setEditingReviewId] = useState(null);
 const [editReviewData, setEditReviewData] = useState({
   rating: 0,
   title: "",
   comment: "",
 });
 const { isLoading: isReviewLoading, error: reviewError } = useSelector(
   (state) => state.review,
 );
 console.log(reviews,"fffffffffffffffff");
   
 async function handleAddToCart (getCurrentProductId){
    if (!user?.userId) {
      promptSignIn({
        description: "Sign in to add items to your cart.",
      });
      return;
    }

    const response = await dispatch(addToCart({userId :user.userId,productId:getCurrentProductId,quantity:1}));
   if (addToCart.fulfilled.match(response)) {
       dispatch(fetchCartItem(user.userId));
   }
     
  }
     async function handleSubmittedReview (e){
      e.preventDefault();

      if (!user?.userId) {
        promptSignIn({
          description: "Sign in to write a review.",
        });
        return;
      }

      const response = await dispatch(createReview({
        productId: productDetails?._id,
        rating: starValue,
        title,
        comment,
      }));

      if (createReview.fulfilled.match(response)) {
        setComment("");
        setTitle("");
        setStarValue(0);
        setRatingResetKey((currentKey) => currentKey + 1);
        toast.add({
          title: "Review submitted",
          description: "Thank you for sharing your feedback.",
          duration: 2000,
        });
        dispatch(getAllReviews());
      }
     }
     useEffect(()=>{
      if (open && productDetails?._id) {
        dispatch(getAllReviews());
      }
     },[dispatch, open, productDetails?._id])

     const productReviews = reviews.filter((review) =>
       String(review.product?._id || review.product) === String(productDetails?._id),
     );

     function startEditingReview(review) {
       setEditingReviewId(review._id);
       setEditReviewData({
         rating: review.rating,
         title: review.title,
         comment: review.comment,
       });
     }

     function cancelEditingReview() {
       setEditingReviewId(null);
       setEditReviewData({ rating: 0, title: "", comment: "" });
     }

     async function handleUpdateReview(event) {
       event.preventDefault();
       const response = await dispatch(updateReview({
         reviewId: editingReviewId,
         ...editReviewData,
       }));

       if (updateReview.fulfilled.match(response)) {
         cancelEditingReview();
         dispatch(getAllReviews());
         toast.add({ title: "Review updated", duration: 2000 });
       }
     }

     async function handleDeleteReview(reviewId) {
       if (!window.confirm("Delete this review? This action cannot be undone.")) {
         return;
       }

       const response = await dispatch(deleteReview(reviewId));
       if (deleteReview.fulfilled.match(response)) {
         dispatch(getAllReviews());
         toast.add({ title: "Review deleted", duration: 2000 });
       }
     }
    return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <LazyImage
            eager
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div className="">
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""} `}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center mt-2">
            <div className="flex item-center gap-0.5">
              <ProductRating
                key={ratingResetKey}
                onRatingChange={setStarValue}
              />
            </div>
            <span className="text-muted-foreground">
              {starValue > 0 ? `${starValue}/5` : "No rating"}
            </span>
          </div>
          <div className="mt-5 mb-5">
            <Button className="w-full" onClick={()=>handleAddToCart(productDetails?._id)}>Add to Cart</Button>
          </div>

          <Separator />
          <div className="relative max-h-75 overflow-auto">
            <h2 className="mb-4 text-xl font-bold">Reviews</h2>
            <form
              onSubmit={handleSubmittedReview}
              className="sticky top-0 z-10 mb-6 flex flex-col gap-4 border-b bg-popover pb-4"
            >
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={!starValue || isReviewLoading}
                placeholder="Review title..."
                aria-label="Review title"
              />
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                disabled={!starValue || isReviewLoading}
                placeholder="Write a review..."
                aria-label="Review comment"
              />
              {reviewError && (
                <p className="text-sm text-destructive">{reviewError}</p>
              )}
              <Button
                type="submit"
                disabled={!starValue || !title.trim() || !comment.trim() || isReviewLoading}
              >
                {isReviewLoading ? "Submitting..." : "Submit review"}
              </Button>
            </form>
            {isReviewsLoading ? (
              <ReviewListSkeleton count={3} />
            ) : reviewsError ? (
              <p className="py-6 text-center text-destructive">{reviewsError}</p>
            ) : productReviews.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="font-medium">No reviews yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to share your experience with this product.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {productReviews.map((eachReview) => {
                  const username = eachReview.user?.username || "Anonymous customer";
                  const isReviewOwner = String(eachReview.user?._id || eachReview.user) === String(user?.userId);
                  const isEditing = editingReviewId === eachReview._id;
                  return (
                    <article key={eachReview._id} className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <Avatar className="size-10 border">
                          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">{username}</h3>
                              <div className="mt-1 flex items-center gap-2">
                                <ProductRating rating={eachReview.rating} readOnly />
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {eachReview.createdAt && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <CalendarDays className="size-3.5" />
                                  {new Date(eachReview.createdAt).toLocaleDateString()}
                                </span>
                              )}
                              {isReviewOwner && !isEditing && (
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => startEditingReview(eachReview)}
                                    aria-label="Edit review"
                                  >
                                    <Pencil />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => handleDeleteReview(eachReview._id)}
                                    aria-label="Delete review"
                                  >
                                    <Trash2 />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          {isEditing ? (
                            <form onSubmit={handleUpdateReview} className="mt-4 grid gap-3">
                              <ProductRating
                                key={`edit-${eachReview._id}-${editReviewData.rating}`}
                                rating={editReviewData.rating}
                                onRatingChange={(rating) => setEditReviewData((current) => ({ ...current, rating }))}
                              />
                              <Input
                                value={editReviewData.title}
                                onChange={(event) => setEditReviewData((current) => ({ ...current, title: event.target.value }))}
                                aria-label="Edit review title"
                              />
                              <Textarea
                                value={editReviewData.comment}
                                onChange={(event) => setEditReviewData((current) => ({ ...current, comment: event.target.value }))}
                                aria-label="Edit review comment"
                              />
                              <div className="flex gap-2">
                                <Button type="submit" disabled={!editReviewData.rating || !editReviewData.title.trim() || !editReviewData.comment.trim() || isReviewLoading}>
                                  {isReviewLoading ? "Saving..." : "Save changes"}
                                </Button>
                                <Button type="button" variant="outline" onClick={cancelEditingReview}>
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <h4 className="mt-4 font-medium">{eachReview.title.toUpperCase()}</h4>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">{eachReview.comment}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
