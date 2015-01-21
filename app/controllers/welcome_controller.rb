class WelcomeController < ApplicationController
  def index
  	@u = User.all()
  end
  def test

  end
  def discover

  end
  def new
  end

  def advanced
  end

  def loading
    render inline: "<meta name='viewport' content='width=device-width, initial-scale=1'>
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
    <style>p{font-family: 'Open Sans', sans-serif;}</style>
    <p align='center'><span>Musicpoint</span><br>
    <b>Notion</b> Engineering </p>"
  end

end
