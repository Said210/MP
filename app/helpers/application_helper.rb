module ApplicationHelper
  def title page_title
    content_for :title, page_title.to_s
  end
  def description page_description
    content_for :description, page_description.to_s
  end
  def body_classes classes
    content_for :body_classes, classes.to_s
  end
end
