class SocialController < ApplicationController
	before_action :authenticate_user!, only:[:me,:profile]
  def me
  	@s =  Post.where(user_id: current_user.id).all
  	@post = Post.new
  end

  def followers
  end

  def enemies
  end

  def likes
  end

  def profile
  	@u = User.find_by(username: params[:id])
  end

end
