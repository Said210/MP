module SocialHelper
	def get_name id
		gotten_user=User.find(id)
		gotten_user.username
	end

	def check_friendship(user1, user2)
		checkpoint = Friend.where(user_id: user1, friend_id: user2)
		checkpoint    
	end
end
