class PicksController < ApplicationController
    def create
        pick = Pick.new(pick_params)
        if pick.save
            game_room = GameRoom.find(pick.game_room_id)
            GameRoomChannel.broadcast_to(game_room, pick)
            #render json: pick
        else
            render json: {errors: pick.errors.full_messages}, status: 422
        end
    end

    private

    def pick_params
        params.require(:pick).permit(:content, :game_room_id)
    end
end
