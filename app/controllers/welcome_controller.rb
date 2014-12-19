class WelcomeController < ApplicationController
  def index
  	@u = User.all()
  end
end
