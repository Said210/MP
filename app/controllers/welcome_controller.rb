class WelcomeController < ApplicationController
  def index
  	@u = User.all()
  end
  def test
  	
  end
end
