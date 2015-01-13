class Favs < ActiveRecord::Base
	belongs_to :user_id, :class_name=>"User", :foreign_key=>"user_id"
	belongs_to :post_id, :class_name=>"Post", :foreign_key=>"post_id"
end
