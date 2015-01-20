class Message < ActiveRecord::Base
	after_create :notify_message_sent
 	

	belongs_to :sent_by, :class_name=>"User", :foreign_key => "sent_by"
	belongs_to :sent_to, :class_name=>"User", :foreign_key => "sent_to"

	validates :message, :length => { :minimum => 1,
									 :maximum => 200, 
									 :too_short =>"You shall not send this message, it's empty",
									 :to_long => "Your message it's too big (200 max)"
									}
	def basic_info_json
	  JSON.generate({sent_by: sent_by, sent_to: sent_to, message: message, timestamp: created_at})
	end

	def notify_message_sent
		Message.connection.execute "NOTIFY messages, '#{self.id}'"
	end

	class << self
	  def on_change
	    Message.connection.execute "LISTEN messages"
	    loop do
	      Message.connection.raw_connection.wait_for_notify do |event, pid, message|
	        yield message
	      end
	    end
	  ensure
	    Message.connection.execute "UNLISTEN messages, '#{self.id}'"
	  end
	end
end
