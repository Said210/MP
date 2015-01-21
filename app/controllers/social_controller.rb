class SocialController < ApplicationController
  include ActionController::Live
	before_action :authenticate_user!, only:[:me,:profile]
  skip_before_filter :verify_authenticity_token

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
    u = User.find(params[:ide])
    puts u
    if u.nil?
      render text: "Not a user"
    else
      checkpoint = check_friendship(current_user.id, u.id)
      if checkpoint[0].nil?
        friendship = Friend.new
        friendship.user_id = current_user
        friendship.friend_id= u
        friendship.save
        redirect_to me_path
      else
        checkpoint[0].destroy
        redirect_to me_path
      end
    end
  end

######################
  
  def check_friendship(user1, user2)
    friendship = Friend.where(user_id: user1, friend_id: user2)
    return friendship    
  end

  def get_friends
    user_id = params[:user_id]
    friend_list = Friend.where(friend_id: user_id).all#User.joins(:friend).where(friends: {friend_id: user_id}).all
    respond_to do |format|
      format.json { render json: friend_list}

    end
  end

  def get_image_url
    @user = User.find(params[:id])
    render inline: "<%= @user.avatar.url(:thumb) %>"
  end


end
