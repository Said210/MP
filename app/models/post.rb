class Post < ActiveRecord::Base
	belongs_to :user_id, :class_name=>"User", :foreign_key=>"user_id"
	
	has_attached_file :asset, :styles => { :medium => "300x300>", :thumb => "100x100>" }, :default_url => "/images/:style/missing.png"

	validates :asset, :attachment_presence => false
	validates_with AttachmentSizeValidator, :attributes => :asset, :less_than => 2.megabytes
	validates_with AttachmentContentTypeValidator, :attributes => :asset, :content_type => ["image/jpeg", "image/png", "image/gif"]
end
