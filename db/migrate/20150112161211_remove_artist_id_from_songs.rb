class RemoveArtistIdFromSongs < ActiveRecord::Migration
  def up
  	add_column :songs, :artist_id
  end
  def down
  	remove_column :songs, :artist_id
  end
end
