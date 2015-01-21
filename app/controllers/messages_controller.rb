class MessagesController < ApplicationController
  include ActionController::Live
  skip_before_filter :verify_authenticity_token
  
  def index
  	@message = Message.new
    @u = current_user
    @listen_at = params[:id]
  end

  def history
  	render json: Message.where("(messages.sent_by = ? AND messages.sent_to = ?) OR (messages.sent_by = ? AND messages.sent_to = ?)", current_user.id,params[:id],params[:id],current_user.id).take(15)
  end


  def live
  	response.headers['Content-Type'] = 'text/event-stream'
  	sse = SSE.new(response.stream)
	begin
		puts "LOAD"
		Message.on_change do |data|
			
      message = Message.find(data)
      if( sent_by_me_to(message, params[:id]) || sent_to_me_by(message, params[:id]) )
        message = message.to_json
        puts "sep"
        sse.write(message)
      else
        puts "Nop"
      end

    end
  	rescue IOError
  	ensure
  		sse.close
  	end
  	render nothing: true
  end

  def profile_chat_monitor
    response.headers['Content-Type'] = 'text/event-stream'
    sse = SSE.new(response.stream)
  begin
    Message.on_change do |data|
      message = Message.find(data)
      if( sent_to_me(message) )
        puts "monitor acceped"
        message = message.to_json
        sse.write(message)
      else
        puts "monitor denied"
      end

    end
    rescue IOError
    ensure
      sse.close
    end
    render nothing: true
  end

  def create
  	m = Message.new
  	m.sent_to = User.find(params[:sent_to])
  	m.sent_by = User.find(current_user.id)
  	m.message = params[:message]
  	if m.save
  		render text: "Done"
  	else
  		render text: "failed"
  	end
  end

  def sent_by_me_to (message, ide)
    if message.sent_by == User.find(current_user.id) && message.sent_to == User.find(ide)
      return true
    else
      return false
    end
  end

  def sent_to_me_by (message, ide)
    if message.sent_by == User.find(ide) && message.sent_to == User.find(current_user.id)
      return true
    else
      return false
    end
  end
  def sent_to_me (message)
    if message.sent_to == User.find(current_user.id)
      return true
    else
      return false
    end
  end

end