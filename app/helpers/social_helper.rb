module SocialHelper
	def get_name id
		gotten_user=User.find(id)
		gotten_user.username
	end
end
