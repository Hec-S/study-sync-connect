import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

interface PortfolioFeedCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
  user: {
    id: string;
    name: string;
    school: string;
  };
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
}

export const PortfolioFeedCard = ({
  id,
  title,
  description,
  imageUrl,
  createdAt,
  likes,
  comments,
  user,
  isLiked = false,
  isSaved = false,
  onLike,
}: PortfolioFeedCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(isSaved);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  const handleLike = () => {
    if (onLike) {
      onLike();
    } else {
      if (!liked) {
        setLikeCount(prev => prev + 1);
      } else {
        setLikeCount(prev => prev - 1);
      }
      setLiked(!liked);
    }
  };

  const handleDoubleTap = () => {
    if (!liked) {
      if (onLike) {
        onLike();
      } else {
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  return (
    <div className="border-b pb-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link 
              to={`/profile/${user.id}`}
              className="font-semibold hover:underline"
            >
              {user.name}
            </Link>
            <p className="text-sm text-muted-foreground">{user.school}</p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">{timeAgo(createdAt)}</span>
      </div>

      {/* Project Image */}
      <div 
        className="relative aspect-[4/3] bg-muted mb-3 overflow-hidden"
        onDoubleClick={handleDoubleTap}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No preview available
          </div>
        )}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-24 h-24 text-white animate-scale-fade" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center px-4 mb-2">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={isLiked ? "text-red-500 hover:text-red-600" : ""}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="w-6 h-6" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSaved(!saved)}
          className={saved ? "text-yellow-500 hover:text-yellow-600" : ""}
        >
          <Bookmark className={`w-6 h-6 ${saved ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Likes Count */}
      <div className="px-4 mb-2">
        <p className="font-semibold">{likes.toLocaleString()} likes</p>
      </div>

      {/* Project Details */}
      <div className="px-4">
        <Link 
          to={`/project/${id}`}
          className="font-bold hover:underline"
        >
          {title}
        </Link>
        <p className="text-sm mt-1">{description}</p>
      </div>

      {/* Comments */}
      {comments > 0 && (
        <div className="px-4 mt-2">
          <button className="text-sm text-muted-foreground hover:text-foreground">
            View all {comments} comments
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioFeedCard;
