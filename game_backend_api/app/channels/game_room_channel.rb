class GameRoomChannel < ApplicationCable::Channel
  def subscribed
    game_room = GameRoom.find(params[:id])
    stream_for game_room
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
