# Mac OS Setup

1. Add the following to your `~/.bash_profile` to avoid the need for `sudo`:

```ruby
# Ruby exports

export GEM_HOME=$HOME/gems
export PATH=$HOME/gems/bin:$PATH
```

2. `gem install jekyll bundler`
3. `cd` into project directory and run `jekyll serve`.
4. Open site in your browser at: `http://localhost:4000/docs/`
