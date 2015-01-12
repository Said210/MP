class AddPostedAtToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :posted_at, :string, :default => "1"
    add_column :posts, :post_type, :string, :default => "Post"
    add_attachment :posts, :asset
  end
end
