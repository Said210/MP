class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_attached_file :avatar, :styles => { :medium => "300x300>", :thumb => "100x100>" }, :default_url => "/images/:style/missing.png"
 	validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/

  has_many :post
  has_many :friend
  has_many :favs
  validates :username,uniqueness: { case_sensitive: false }

  def get_pp_of(index)
    @user = User.find(index)
    return @user.avatar.url(:thumb)
  end
  class << self
    def get_usable_values index
      user = User.find_by(username: index)
      user.avatar_file_name = user.avatar.url(:thumb)
      return user
    end
  end
end
