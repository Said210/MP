Rails.application.routes.draw do
  
  get '/me' => 'social#me'
  get '/followers' => 'social#followers'
  get '/enemies' => 'social#enemies'
  get '/likes' => 'social#likes'

  get '/test' => 'welcome#test'
  get '/discover' => 'welcome#discover'
  get '/similar' => 'welcome#new'
  get '/advanced' => 'welcome#advanced'

  #Social Magic#
  post '/add' => 'social#add', as: :add 
   #End of social Magic#

  devise_for :users, :controllers => { registrations: 'registrations' }

  get '/p/by/:id' => 'posts#by_user'#, :constraints => {:subdomain => 'api'}

  ##### API #####
  #namespace :api, path: '', constraints: {subdomain: 'api'} do
    resources :posts
    get '/u/:id' => 'social#profile'
  #end
  
  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
  
  root 'welcome#index'

end