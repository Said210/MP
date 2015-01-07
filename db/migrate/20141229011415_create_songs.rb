class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name
      t.string :spotify_id
      t.integer :artist_id
      t.integer :clicked
      
      t.timestamps
    end
  end
end
