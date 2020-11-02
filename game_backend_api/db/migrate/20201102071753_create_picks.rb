class CreatePicks < ActiveRecord::Migration[6.0]
  def change
    create_table :picks do |t|
      t.string :content
      t.integer :game_room_id

      t.timestamps
    end
  end
end
