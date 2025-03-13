import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, Star, Loader2 } from "lucide-react";
import { getRecentReviews } from "@/services/professorRatings";
import { motion } from "framer-motion";

export const RecentReviewsList = () => {
  const navigate = useNavigate();
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentReviews();
  }, []);

  const fetchRecentReviews = async () => {
    try {
      setLoading(true);
      const reviews = await getRecentReviews();
      setRecentReviews(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="max-w-2xl mx-auto mt-12 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <ThumbsUp className="w-6 h-6 text-primary" />
        Recent Reviews
      </h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : recentReviews.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600">No reviews yet. Be the first to add a review!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {recentReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 
                        className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-primary"
                        onClick={() => navigate(`/professor/${review.professor_id}`)}
                      >
                        {review.professor?.professor_name || "Unknown Professor"}
                      </h3>
                      <p className="text-primary font-medium">{review.course}</p>
                    </div>
                    <div className="flex gap-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {review.review}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecentReviewsList;
