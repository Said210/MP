class SocialController < ApplicationController
	before_action :authenticate_user!, only:[:me,:profile]
  skip_before_filter :verify_authenticity_token, only:[:add]
  def me
  	@s =  Post.where(user_id: current_user.id).all
  	@post = Post.new
    friends_list = Friend.where(user_id: current_user.id)
    @friends = friends_list
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

  def add
    u = User.find_by(username: params[:username])
    checkpoint = Friend.where(user_id: current_user.id, friend_id: u.id)
    if checkpoint[0].nil?
      friendship = Friend.new
      friendship.user_id = current_user.id
      friendship.friend_id= u.id
      friendship.save
      redirect_to me_path
    else
      render text:"Already a friend"
    end
  end

end
