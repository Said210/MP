module PostsHelper

	def userimage id
		got_user=User.find(id)
		url=got_user.avatar.url(:thumb)
		image_tag url, :width=>"50px"
	end

end
