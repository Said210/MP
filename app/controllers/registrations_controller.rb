class RegistrationsController < Devise::RegistrationsController
 
  private
 
  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :username, :avatar)
  end
 
  def account_update_params
    params.require(:user).permit(:password, :password_confirmation, :avatar)
  end
end