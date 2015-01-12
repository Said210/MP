class RemoveArtistIdFromPosts < ActiveRecord::Migration
  def change
  	remove_column :posts, :artist_id
  end
end
