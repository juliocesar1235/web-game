class GameRoomsController < ApplicationController
    def index
        game_rooms = GameRoom.all
        render json: game_rooms
    end

    def create
        game_room = GameRoom.new(game_room_params)
        if game_room.save
            render json: game_room
        else
            render json: {errors: game_room.errors.full_messages}, status: 422
        end
    end

    def show
        game_room = GameRoom.find_by(id: params[:id])
        render json: game_room
    end

    private

    def game_room_params
        params.require(:game_room).permit(:name)
    end
end
