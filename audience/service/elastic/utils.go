package elastic

import (
	url "net/url"
)

func UserInfo(rawurl string) (user, pass string, err error) {
	u, err := url.Parse(rawurl)
	if err != nil {
		return "", "", err
	}

	if u.User == nil {
		return "", "", nil
	}

	p, _ := u.User.Password()

	return u.User.Username(), p, nil
}

func StripUserInfo(rawurls ...string) ([]string, error) {
	var urls = make([]string, len(rawurls))
	for i, rawurl := range rawurls {
		u, err := url.Parse(rawurl)
		if err != nil {
			return nil, err
		}
		// stip user/pass info
		u.User = nil

		urls[i] = u.String()
	}

	return urls, nil
}
