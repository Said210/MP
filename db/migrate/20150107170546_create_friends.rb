class CreateFriends < ActiveRecord::Migration
  def change
    create_table :friends do |t|
      t.integer :user_id
      t.integer :friend_id 
      t.integer :state, :default => 0 # Cero igual a aceptado Uno igual a pendiente

      t.timestamps
    end
  end
end
