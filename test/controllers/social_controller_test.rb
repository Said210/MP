require 'test_helper'

class SocialControllerTest < ActionController::TestCase
  test "should get me" do
    get :me
    assert_response :success
  end

  test "should get followers" do
    get :followers
    assert_response :success
  end

  test "should get enemies" do
    get :enemies
    assert_response :success
  end

  test "should get likes" do
    get :likes
    assert_response :success
  end

end
