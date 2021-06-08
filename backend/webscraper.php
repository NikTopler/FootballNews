<?php
include_once 'user.php';

class WebScraper {
  public $website = 'https://www.google.com/search?tbm=isch&q=';
  public $images = array();

  public function setup($website) {
    $html = file_get_contents($website);
    $news_doc = new DOMDocument();

    libxml_use_internal_errors(TRUE);

    if(empty($html)) {
      echo 0;
      die;
    }

    $news_doc->loadHTML($html);
    libxml_clear_errors();

    return new DOMXPath($news_doc);
  }

  public function googleImage($query) {
    $website = $this->website.$query;
    $xpath = $this->setup($website);

    $images = $xpath->query('//img');
    foreach($images as $row) {
      $link = $row->getAttribute('src');
      if(strpos($link, '.gif') == false) {
        echo $link;
        die;
      }
    }
  }
}

$webScraperObj = new WebScraper();
if(isset($_POST['GOOGLE_IMAGE'])) $webScraperObj->googleImage($_POST['GOOGLE_IMAGE']);

