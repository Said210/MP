class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, only:[:index,:create,:new,:update,:destroy, :create_attached_song_post]
  skip_before_filter :verify_authenticity_token
  
  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
  end

  def get_post_favs
    f=Favs.where(post_id: params[:id]).all
    @favs = [total: f.count]
    @favs += [favorites: f]
    respond_to do |format|
      format.json { render json: @favs}
    end
  end

  def at_user
    ref_id=params[:id]
    @posts = []
    i = 0
    posts = Post.where(posted_at: ref_id).select(:id,:user_id,:text,:posted_at,:post_type,:updated_at,:song_uri).limit(10).order('created_at desc')
    posts.each { |post|
      t_f = Favs.where(post_id: post.id).select(:user_id).all
      @posts += [post: post, favs: t_f, total_favs: t_f.count]

    }
    respond_to do |format|
      format.json { render json: @posts}
    end
  end
  def get_image_url
    @post = Post.find(params[:id])
    render inline: "<%= @post.asset.url(:medium) %>"
  end

  # GET /posts/new
  def new
    @post = Post.new  
  end

  # GET /posts/1/edit
  def edit
    begin
      puts params[:id]
      if(!post_belongs_user(params[:id], current_user.id)) 
        flash[:alert] = "You have no permison to do that"
        redirect_to :back
      end
    rescue
      redirect_to root_path
    end
  end

  # POST /posts
  # POST /posts.json
  def create
    @post = Post.new(post_params)
    @post.user_id=current_user
    @post.currentdate=Time.now.utc.strftime("%Y-%m-%d %I:%M")
    if @post.text == "" || @post.text.nil?
      flash[:alert] = "Su mensaje esta vacio, debe añadir algo de texto."
      redirect_to :back
    else
      respond_to do |format|
        if @post.save
          format.html { redirect_to :back, notice: 'Post was successfully created.' }
          format.json { render :show, status: :created, location: @post }
        else
          format.html { render :new }
          format.json { render json: @post.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  def create_attached_song_post
    if params[:text].nil?
      render text: "You need to fill text field"
    else
      @post = Post.new
      @post.user_id = params[:user_id].nil? ? current_user : User.find(params[:user_id])
      @post.posted_at = params[:posted_at].nil? ? current_user.id : User.find(params[:posted_at])
      @post.text = params[:text]
      @post.currentdate=Time.now.utc.strftime("%Y-%m-%d %I:%M")
      if params[:song_uri]
        @post.post_type="Song"
        @post.song_uri=params[:song_uri]
      else
        @post.post_type="Post"
      end
      respond_to do |format|
        if @post.save
          format.html { render text: "Post was successfully created.", notice: 'Post was successfully created.' }
          format.json { render json: @post }
        else
          format.html { render :new }
          format.json { render json: @post.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to :back, notice: 'Post was successfully updated.' }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    if(post_belongs_user(params[:id],current_user.id) || post_at_user(params[:id],current_user.id))
      @post.destroy
      respond_to do |format|
        format.html { redirect_to :back, notice: 'Post was successfully destroyed.' }
        format.json { head :no_content }
      end
    else
      begin
        flash[:alert] = "You have no permison to do that"
        redirect_to :back
      rescue
        redirect_to root_path
      end
    end
  end

  def user_favs_post
    user_param = User.find(params[:user_id])
    post_param = Post.find(params[:post_id])
    res = Favs.where(post_id: post_param, user_id: user_param)[0]
    if res.nil?
      f=Favs.new
      f.user_id=user_param
      f.post_id=post_param
      if f.save
        render text: "Liked"
      else
        render text: "Faild"
      end
    else
      res.destroy
      render text: "Unliked"
    end
end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_params
      params.require(:post).permit( :text, :currentdate, :asset, :posted_at,:post_type)
    end
end

########### METHODS #########
  def post_belongs_user post_id_param, user_id_param
    if(Post.find(post_id_param).user_id.id == user_id_param)
      return true
    else
      return false
    end
  end
  def post_at_user post_id_param, user_id_param
    if(Post.find(post_id_param).posted_at == user_id_param.to_s)
      return true
    else
      return false
    end
  end

