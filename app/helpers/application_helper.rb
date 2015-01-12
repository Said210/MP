module ApplicationHelper
  def title page_title
    content_for :title, page_title.to_s
  end
  def description page_description
    content_for :description, page_description.to_s
  end
  def body_classes classes
    content_for :body_classes, classes.to_s
  end
  def get_name id
		gotten_user=User.find(id)
		gotten_user.username
	end

	def check_friendship(user1, user2)
		checkpoint = Friend.where(user_id: user1, friend_id: user2)
		checkpoint    
	end
end
