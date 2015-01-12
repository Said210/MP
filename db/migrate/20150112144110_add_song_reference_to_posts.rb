class AddSongReferenceToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :song_id, :integer
  end
end
