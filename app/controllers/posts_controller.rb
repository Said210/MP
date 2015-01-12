class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, only:[:index,:create,:new,:update,:destroy]
  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
  end

  def at_user
    ref_id=params[:id]
    posts = Post.where(posted_at: ref_id).limit(10).order('created_at desc')
    respond_to do |format|
      format.json { render json: posts}
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

