class PicksController < ApplicationController
    def create
        pick = Pick.new(content: params[:pick][:content], game_room_id: params[:pick][:play_room_id])
        if pick.save
            game_room = GameRoom.find(pick.game_room_id)
            GameRoomChannel.broadcast_to(game_room, pick)
            #render json: pick
        else
            render json: {errors: pick.errors.full_messages}, status: 422
        end
    end

    private

end
