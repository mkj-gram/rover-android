//
//  SignInViewController.swift
//  Auth
//
//  Created by Sean Rucker on 2018-05-19.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

open class SignInViewController: UIViewController {
    override open var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    public let logo: UIImageView = {
        let imageView = UIImageView()
        imageView.translatesAutoresizingMaskIntoConstraints = false
        return imageView
    }()
    
    public let errorLabel: UILabel = {
        let label = UILabel()
        label.isHidden = true
        label.font = UIFont.systemFont(ofSize: 14, weight: UIFont.Weight.regular)
        label.text = "Email and password don't match"
        label.textColor = UIColor.pink
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    public let emailField: UnderlineTextField = {
        let textField = UnderlineTextField()
        textField.autocapitalizationType = .none
        textField.autocorrectionType = .no
        textField.clearButtonMode = .whileEditing
        textField.enablesReturnKeyAutomatically = true
        textField.keyboardType = .emailAddress
        textField.placeholder = "Email"
        textField.returnKeyType = .next
        textField.spellCheckingType = .no
        textField.translatesAutoresizingMaskIntoConstraints = false
        return textField
    }()
    
    public let passwordField: UnderlineTextField = {
        let textField = UnderlineTextField()
        textField.clearButtonMode = .whileEditing
        textField.enablesReturnKeyAutomatically = true
        textField.isSecureTextEntry = true
        textField.placeholder = "Password"
        textField.returnKeyType = .go
        textField.translatesAutoresizingMaskIntoConstraints = false
        return textField
    }()
    
    public let submitButton: RoundedButton = {
        let button = RoundedButton()
        button.isEnabled = false
        button.setTitle("Sign In", for: .normal)
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }()
    
    public let activityIndicator: UIActivityIndicatorView = {
        let indicator = UIActivityIndicatorView()
        indicator.hidesWhenStopped = true
        indicator.translatesAutoresizingMaskIntoConstraints = false
        return indicator
    }()
    
    private var logoTopConstraint: NSLayoutConstraint!
    private var emailFieldTopConstraint: NSLayoutConstraint!
    
    override open func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = UIColor(red: 52/255, green: 58/255, blue: 76/255, alpha: 1.0)
        
        setTextFieldDelegates()
        addViews()
        setupConstraints()
        addTapGesture()
        observeKeyboardNotifications()
        addSubmitButtonTarget()
    }
    
    public func setLogoImage(image: UIImage) {
        logo.image = image
        logo.sizeToFit()
    }
    
    @objc func signIn() {
        guard let email = emailField.text, let password = passwordField.text else {
            return
        }
        
        Session.shared.authenticate(email: email, password: password) { result in
            DispatchQueue.main.async {
                if case .failed = result {
                    self.errorLabel.isHidden = false
                }
                
                self.emailField.isEnabled = true
                self.passwordField.isEnabled = true
                self.passwordField.text = nil
                self.submitButton.setTitle("Sign In", for: .normal)
                self.activityIndicator.stopAnimating()
            }
        }
        
        emailField.isEnabled = false
        passwordField.isEnabled = false
        submitButton.isEnabled = false
        submitButton.setTitle("Signing In...", for: .normal)
        activityIndicator.startAnimating()
    }
    
    func setTextFieldDelegates() {
        emailField.delegate = self
        passwordField.delegate = self
    }
    
    func addViews() {
        view.addSubview(logo)
        view.addSubview(errorLabel)
        view.addSubview(emailField)
        view.addSubview(passwordField)
        view.addSubview(submitButton)
        view.addSubview(activityIndicator)
    }
    
    func setupConstraints() {
        let margins = view.layoutMarginsGuide
        
        if #available(iOS 11.0, *) {
            logoTopConstraint = logo.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 80)
        } else {
            logoTopConstraint = logo.topAnchor.constraint(equalTo: view.topAnchor, constant: 80)
        }
        logoTopConstraint.isActive = true
        
        logo.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        
        errorLabel.topAnchor.constraint(equalTo: logo.bottomAnchor, constant: 20).isActive = true
        errorLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        
        emailFieldTopConstraint = emailField.topAnchor.constraint(equalTo: logo.bottomAnchor, constant: 50)
        emailFieldTopConstraint.isActive = true
        
        emailField.rightAnchor.constraint(equalTo: margins.rightAnchor).isActive = true
        emailField.leftAnchor.constraint(equalTo: margins.leftAnchor).isActive = true
        
        passwordField.topAnchor.constraint(equalTo: emailField.bottomAnchor, constant: 25).isActive = true
        passwordField.rightAnchor.constraint(equalTo: margins.rightAnchor).isActive = true
        passwordField.leftAnchor.constraint(equalTo: margins.leftAnchor).isActive = true
        
        submitButton.topAnchor.constraint(equalTo: passwordField.bottomAnchor, constant: 30).isActive = true
        submitButton.rightAnchor.constraint(equalTo: margins.rightAnchor).isActive = true
        submitButton.leftAnchor.constraint(equalTo: margins.leftAnchor).isActive = true
        
        activityIndicator.rightAnchor.constraint(equalTo: submitButton.layoutMarginsGuide.rightAnchor).isActive = true
        activityIndicator.centerYAnchor.constraint(equalTo: submitButton.centerYAnchor).isActive = true
    }
    
    func addTapGesture() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        view.addGestureRecognizer(tap)
    }
    
    @objc func dismissKeyboard() {
        view.endEditing(true)
    }
    
    func observeKeyboardNotifications() {
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow(_:)), name: Notification.Name.UIKeyboardWillShow, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide(_:)), name: Notification.Name.UIKeyboardWillHide, object: nil)
    }
    
    @objc func keyboardWillShow(_ notification: Notification) {
        errorLabel.isHidden = true
        
        guard let userInfo = notification.userInfo, let duration = userInfo[UIKeyboardAnimationDurationUserInfoKey] as? Double, let curve = userInfo[UIKeyboardAnimationCurveUserInfoKey] as? NSNumber else {
            return
        }
        
        let options = UIViewAnimationOptions(rawValue: UInt(curve.uintValue << 16))
        
        logoTopConstraint.constant = 20
        emailFieldTopConstraint.constant = 15
        
        UIView.animate(withDuration: duration, delay: 0, options: options, animations: {
            self.view.layoutIfNeeded()
        }, completion: nil)
    }
    
    @objc func keyboardWillHide(_ notification: Notification) {
        guard let userInfo = notification.userInfo, let duration = userInfo[UIKeyboardAnimationDurationUserInfoKey] as? Double, let curve = userInfo[UIKeyboardAnimationCurveUserInfoKey] as? NSNumber else {
            return
        }
        
        let options = UIViewAnimationOptions(rawValue: UInt(curve.uintValue << 16))
        
        self.logoTopConstraint.constant = 80
        self.emailFieldTopConstraint.constant = 50
        
        UIView.animate(withDuration: duration, delay: 0, options: options, animations: {
            self.view.layoutIfNeeded()
        }, completion: nil)
    }
    
    func addSubmitButtonTarget() {
        submitButton.addTarget(self, action: #selector(signIn), for: UIControlEvents.touchUpInside)
    }
}

extension SignInViewController: UITextFieldDelegate {
    public func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        switch textField {
        case emailField:
            emailField.resignFirstResponder()
            emailField.layoutIfNeeded()
            passwordField.becomeFirstResponder()
        case passwordField:
            passwordField.resignFirstResponder()
        default:
            break
        }
        
        return false
    }
    
    public func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        guard let text = textField.text, !(text as NSString).replacingCharacters(in: range, with: string).isEmpty else {
            submitButton.isEnabled = false
            return true
        }
        
        switch textField {
        case emailField:
            submitButton.isEnabled = !(passwordField.text?.isEmpty ?? true)
        case passwordField:
            submitButton.isEnabled = !(emailField.text?.isEmpty ?? true)
        default:
            break
        }
        
        return true
    }
}
