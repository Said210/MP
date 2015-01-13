Rails.application.routes.draw do
  
  get '/u/:id' => 'social#profile'

  get '/me' => 'social#me'
  get '/followers' => 'social#followers'
  get '/enemies' => 'social#enemies'
  get '/likes' => 'social#likes'

  get '/test' => 'welcome#test'
  get '/discover' => 'welcome#discover'
  get '/similar' => 'welcome#new'
  get '/advanced' => 'welcome#advanced'

  #Social Magic#
  get '/get/friendlist/:user_id' => 'social#get_friends'
  post '/add' => 'social#add', as: :add 
   #End of social Magic#

  devise_for :users, :controllers => { registrations: 'registrations' }

  

  ##### API #####
  #namespace :api, path: '', constraints: {subdomain: 'api'} do
    resources :posts
    get '/p/pic/:id' => 'posts#get_image_url'
    get '/p/at/:id' => 'posts#at_user'#, :constraints => {:subdomain => 'api'}
    get 'api/p/get/favs/:id' => 'posts#get_post_favs'
    get '/api/u/get/pic/:id' => 'social#get_image_url'
    post '/p/fav' => 'posts#user_favs_post'

    post '/p/create' => 'posts#create_attached_song_post'
    
  #end
  
  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
  
  root 'welcome#index'

end