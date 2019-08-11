# Hugo Enhanced Web Feeds

> Note: A German translation of this description is available [here](https://julian.pawlowski.me/de/docs/hugo-web-feeds/).
> Hinweis: Eine deutsche Übersetzung dieser Beschreibung ist [hier](https://julian.pawlowski.me/de/docs/hugo-web-feeds/) verfügbar.

This is a **supplementary theme** for other Hugo themes that will help to generate [web feeds](https://en.wikipedia.org/wiki/Web_feed) in the formats [Atom](https://en.wikipedia.org/wiki/Atom_(Web_standard)), [RSS 2.0](https://en.wikipedia.org/wiki/RSS) and the fairly new [JSON Feed](https://jsonfeed.org/) to allow site visitors to subscribe to the content you create.

A list of major supported features:

* Full multi-language support
* Multi-user support with author profile pages, both on site and page level
* Supports full content and summary, customizable on site and page level
* Subtitle support
* Taxonomy support
* Custom URN support for Atom and JSON feed IDs on site and page level

This is what's on the To-Do list right now:

* [WebSub](https://en.wikipedia.org/wiki/WebSub) support

## Table of Contents

1. [Provided Feed Formats](#provided-feed-formats)
2. [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installing](#installing)
3. [Deployment](#deployment)
    * [General Web Server Configuration](#general-web-server-configuration)
    * [Netlify](#netlify)
    * [Nginx](#nginx)
    * [Apache](#apache)
4. [Built For](#built-for)
5. [Versioning](#versioning)
6. [Authors](#authors)
7. [License](#license)
8. [Acknowledgments](#acknowledgments)

________________________________________________________________________________

## Provided Feed Formats

### Atom 1.0 Feed (Modern Feed Format)

This is today's default format to consume a web feed and should be what you offer to your visitors and readers.

The default file name for Atom feeds is `feed.atom` (also see [`.atom` file extension](https://filext.com/file-extension/ATOM)).

### JSON Feed (Alternative Feed Format)

This format came up as an [idea of Manton Reece and Brent Simmons](https://jsonfeed.org/) in 2017 and has seen quite prominent adoption to sites since then.

However, on Wikipedia it is currently only known as "just another type" of [data feeds](https://en.wikipedia.org/wiki/Data_feed) with no relation to be an official [web feed](https://en.wikipedia.org/wiki/Web_feed) format yet. This is why the JSON Feed format is marked as _experimental_ here, especially as visitors need to have a state-of-the-art feed reader that is supporting this brand new format. That is why it cannot be the only format offered without risking to loose interest of visitors to subscribe.

The default file name for JSON Feed files is `feed.json`.

### Extended RSS 2.0 Feed (Legacy Feed Format)

The RSS 2.0 feed will replace the Hugo built-in RSS feed and is extended using several commonly used [XML namespaces](https://en.wikipedia.org/wiki/XML_namespace) for enhanced functionality that is almost similar to what an Atom 1.0 feed provides.

However, it is not guaranteed that each and every feed reader will respect those extensions properly.
That is why this feed type is marked as _legacy_ and shall only be offered as a fallback to end users (if at all) in case anyone of them is not able to consume the Atom feed.

Also note that there are still some important differences between the two formats, in particular when content is being updated or corrected while a user had already downloaded a version of the feed that contained an earlier version of that particular content.

Using the _Hugo Web Feeds_ theme, the default file name for RSS feeds is automatically changed from `index.xml` to `feed.rss` (also see [`.rss` file extension](https://filext.com/file-extension/RSS)).

## Getting Started

### Prerequisites

As web feeds are not intended for direct consumption without using another peace of software (see [news aggregator](https://en.wikipedia.org/wiki/News_aggregator)), _Hugo Web Feeds_ is a supplementary theme that will support other themes by only creating the required additional plain text files.

That means you first need to install and configure a regular Hugo theme that will generate real content structures and HTML pages for your site.

See instructions on the [Hugo documentation pages](https://gohugo.io/hosting-and-deployment/deployment-with-nanobox/#install-a-theme) to learn how to do that.

### Installing

There are basically two ways to include web feeds to your own site or theme:

#### Using Git Submodules

For easier updates of the _Hugo Web Feeds_ theme component, it is recommended to make use of [Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

This is how:

```shell
git submodule add -b master https://github.com/jpawlowski/hugo-web-feeds.git themes/web-feeds/
```

Now, whenever you clone a fresh copy of your own project's Git repository, you will need to make sure to also check out all submodules in use. This is an example:

```shell
git clone --recurse-submodules https://github.com/<USERNAME>/MyProject
```

Also note that if you are using multiple branches in your Git repository, this requires special handling to ensure the submodule was properly added to each of it. This also applies whenever you are planning to update the _Hugo Web Feeds_ theme to a newer version (meaning to a different commit ID, actually).

I will not go into more details here. Either use a good Git GUI application or have a look to the [Git documentation pages](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

#### Alternative: Using a copy

If you simply want to go with the current version and don't care about any future update paths or code history, you may simply download a copy of the latest source code to your own project directory:

```shell
mkdir -p themes/; curl -fsSL https://github.com/jpawlowski/hugo-web-feeds/archive/master.tar.gz | tar zx -C themes/; mv themes/hugo-web-feeds-master/ themes/web-feeds/
```

This will install the theme to the `themes/web-feeds/` folder.

#### Enabling the feeds

In your site's `config.toml` file, find the `theme = [...]` variable and add `web-feeds` **in front of** whatever you have in there already:

```toml
theme = [ "web-feeds", "my-theme" ]
```

As this is a supplementary theme, it needs to be processed before all other themes so the order is really playing an important role here.

Also note that the variable is now in slice format (see the brackets?). If you had only enabled a single theme before, it might have been a simple `key = "value"` pair so keep that in mind.

Next, find the `[outputs]` section to either replace `"RSS"`, or add `"Atom"` and `"JSONFeed"` to it:

```toml
[outputs]
  home     = ["HTML", "RSS", "Atom", "JSONFeed"]    # optionally remove RSS here
  section  = ["HTML", "RSS", "Atom", "JSONFeed"]    # optionally remove RSS here
  taxonomy = ["HTML", "RSS", "Atom", "JSONFeed"]    # optionally remove RSS here
```

#### Autodiscovery

Unfortunately _Hugo Web Feeds_ is unable to automatically help you with autodiscovery as HTML rendering must be part of the other theme you are using. There is a generic code snippet for you to add to the `layouts/partials/head.html` file or wherever your theme as left a way to add some custom code to the HTML `<head>` element.

```html
{{ partial "feed_header.html" . }}
```

## Deployment

### General Web Server Configuration

It is a good idea to have your web server configured to send the correct [`Content-Type` HTTP response header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Type) when delivering the feed files. This is likewise important for Atom and RSS feed types.

While this might not be necessary for most of the feed readers to work, it plays quite an important role in the user experience when visitors subscribe to your feed. By sending the correct `Content-Type` information, the browser will be able to look for an application on the persons device that is capable to handle this file type – like a feed reader in our case. That is of course, if the browser was properly supporting this (e.g. [Chrome is not](https://bugs.chromium.org/p/chromium/issues/detail?id=84)) _and_ the local feed reader had actually claimed to be able to handle web feeds.

This however is nothing we can influence. what we can do from our end is to provide the most useful information to the visitor's software in our feed files and when delivering it.

To be able to do all this, your web server needs to know about the the file's [MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) which it usually dereives from the file's extension name for types that it was configured for. This is not possible for `.xml` file extensions as this only implies that the file was in XML format but not what kind of dialect that content was defined for. This is why we (re)named our feed files `feed.atom` and `feed.rss` in the first place.

You may check your web server headers for the respective feed URL either by using the [developer functions in your web browser](https://is.gd/6AiTqV) or by using [free online services](https://is.gd/VsypOA) like [Cloxy Tools](https://headers.cloxy.net/).

For Atom feeds, the `Content-Type:` line will need to look like this:

```http
Content-Type: application/atom+xml; charset=UTF-8
```

RSS feeds will need to be sent using this `Content-Type:`:

```http
Content-Type: application/rss+xml; charset=UTF-8
```

JSON feeds will likely be okay already as they are no different from other JSON files using this `Content-Type:`:

```http
Content-Type: application/json; charset=UTF-8
```

If this does not look exactly like this (even if the [`charset` setting](https://www.w3.org/International/articles/http-charset/) was missing), you will need to tweak the configuration of your web server. This depends on the software you use. Some examples and hints can be found below.

### Netlify

Add header definitions to your `netlify.toml` file like this:

```toml
[[headers]]
  for = "*.atom"
  [headers.values]
    Content-Type = "application/atom+xml; charset=UTF-8"
[[headers]]
  for = "*.rss"
  [headers.values]
    Content-Type = "application/rss+xml; charset=UTF-8"
```

To learn more about custom headers on Netlify, [go to the docs](https://www.netlify.com/docs/headers-and-basic-auth/) or read [this](https://www.netlify.com/blog/2017/10/17/introducing-structured-redirects-and-headers/) blog post.

### Nginx

Go to read more about the [Types](https://nginx.org/en/docs/http/ngx_http_core_module.html#types) directive.

### Apache

Go to read more about the [AddType](http://httpd.apache.org/docs/mod/mod_mime.html#addtype) directive.

### Microsoft IIS

Go to read more about the [Configuration of MIME  Types in IIS 7](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc753281(v=ws.10)), [Configuring HTTP Response Headers in IIS 7](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc771148(v=ws.10)) or [Modifying HTTP Response Headers](https://docs.microsoft.com/iis/extensions/url-rewrite-module/modifying-http-response-headers).

________________________________________________________________________________

## Built For

* [Hugo](https://gohugio.io/) - The web framework of choice

## Versioning

We use [SemVer](http://semver.org/) for versioning. However, the version is only reflected as part of the [theme.toml](theme.toml) file.

Production and staging versions of this theme are differentiated using branches.

For your production sites, the `master` branch is what you want to use.

If you want to test some new functionality that you know is still in development, the `dev` branch is what you are looking for.

For all the branches available, see the [branches on this repository](https://github.com/jpawlowski/hugo-web-feeds/branches).

## Authors

* **Julian Pawlowski** - *Several extensions and enhancements, RSS 2.0 and JSON Feed adoption* - [hugo-web-feeds](https://github.com/jpawlowski/hugo-web-feeds)
* **Kaushal Modi** - *Initial work for standalone Atom feed* - [hugo-atom-feed](https://github.com/kaushalmodi/hugo-atom-feed)

See also the list of [other contributors](https://github.com/jpawlowski/hugo-web-feeds/contributors) who participated in this project.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

* Thank [Kaushal Modi](https://github.com/kaushalmodi) for teaching me about Hugo and Go programming syntax and sharing ideas.
* Thank [George Cushen](https://github.com/gcushen) for his initial inspiration as part of his awesome [Academic theme](https://github.com/gcushen/hugo-academic)
* Thank [Billie Thompson](https://github.com/PurpleBooth) for her idea to provide a great [template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) and structure for this README file
