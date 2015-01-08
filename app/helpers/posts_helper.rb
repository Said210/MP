module PostsHelper

	def userimage id
		gotten_user=User.find(id)
		url=gotten_user.avatar.url(:thumb)
		image_tag url, :width=>"50px"
	end

end
