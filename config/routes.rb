Rails.application.routes.draw do
  
  get '/u/:id' => 'social#profile', as: :profile # Loads profiles

  get '/me' => 'social#me' # Loads current user profile
  get '/followers' => 'social#followers' #Gets Followers list 
  get '/enemies' => 'social#enemies'#Gets enemies list
  get '/likes' => 'social#likes' #Gets favs list 

  get '/test' => 'welcome#test' 
  get '/discover' => 'welcome#discover' # Discover new music search based 
  get '/similar' => 'welcome#new' # Similar artist and top tracks
  get '/advanced' => 'welcome#advanced' # Advanced search (In development)

  get '/get/friendlist/:user_id' => 'social#get_friends' # Gets followers list
  post '/add' => 'social#add', as: :add # Add or remove realiton between users

  devise_for :users, :controllers => { registrations: 'registrations' }

  

  ##### API #####
  #namespace :api, path: '', constraints: {subdomain: 'api'} do
    resources :posts
    get '/p/pic/:id' => 'posts#get_image_url' # Returns post image url
    get '/p/at/:id' => 'posts#at_user' # Returns posts at user's profile
    get '/api/p/get/favs/:id' => 'posts#get_post_favs' # Returns JSON list of a post favs
    get '/api/u/get/pic/:id' => 'social#get_image_url' # Returns User PP URL
    post '/p/fav' => 'posts#user_favs_post' # User fav or unfav posts

    post '/p/create' => 'posts#create_attached_song_post' # Create a post with the posibility to attach a song
    
    resources :messages
    get '/api/get/messages/:id' => 'messages#history'
    get '/message/:id' => 'messages#index'
    post '/api/message/send' => 'messages#create' # Sends a message
    get '/live/:id' => 'messages#live'
  #end


  root 'welcome#index'

end