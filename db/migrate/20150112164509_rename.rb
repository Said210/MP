class Rename < ActiveRecord::Migration
  def up
  	rename_column :posts, :song_id, :song_uri
  	change_column :posts, :song_uri,  :string
  end

  def down
  	rename_column :posts, :song_uri, :song_id
  	change_column :posts, :song_uri,  :integer
  end
end
