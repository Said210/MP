json.array!(@posts) do |post|
  json.extract! post, :id, :user_id, :text, :currentdate
  json.url post_url(post, format: :json)
end
