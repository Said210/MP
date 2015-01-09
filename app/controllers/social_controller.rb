class SocialController < ApplicationController
	before_action :authenticate_user!, only:[:me,:profile]
  skip_before_filter :verify_authenticity_token, only:[:add]
  def me
    redirect_to '/u/'+current_user.username
  end

  def followers
  end

  def enemies
  end

  def likes
  end

  def profile
    @post = Post.new
  	if current_user.username == params[:id]
      @u = current_user
      @me = true  
    else
      @u = User.find_by(username: params[:id])
      @me = false
    end
    friends_list = Friend.where(user_id: @u.id)
    @friends = friends_list
  end

  def add
    u = User.find_by(username: params[:username])
    if u.nil?
      render text: "Not a user"
    else
      checkpoint = check_friendship(current_user.id, u.id)
      if checkpoint[0].nil?
        friendship = Friend.new
        friendship.user_id = current_user.id
        friendship.friend_id= u.id
        friendship.save
        redirect_to me_path
      else
        checkpoint[0].destroy
        redirect_to me_path
      end
    end
  end

  def check_friendship(user1, user2)
    friendship = Friend.where(user_id: user1, friend_id: user2)
    return friendship    
  end

end
