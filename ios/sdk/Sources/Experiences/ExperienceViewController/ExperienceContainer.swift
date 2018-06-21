//
//  ExperienceContainer.swift
//  RoverExperiences
//
//  Created by Sean Rucker on 2018-02-09.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

import UIKit

open class ExperienceContainer: UIViewController {
    public let identifier: ExperienceIdentifier
    public let store: ExperienceStore
    public let viewControllerProvider: (Experience) -> UIViewController
    
    override open var childViewControllerForStatusBarStyle: UIViewController? {
        return self.childViewControllers.first
    }
    
    open var activityIndicator: UIActivityIndicatorView = {
        let activityIndicator = UIActivityIndicatorView(activityIndicatorStyle: .whiteLarge)
        activityIndicator.color = UIColor.gray
        activityIndicator.hidesWhenStopped = true
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        return activityIndicator
    }()
    
    open var cancelButton: UIButton = {
        let cancelButton = UIButton(type: .custom)
        cancelButton.translatesAutoresizingMaskIntoConstraints = false
        cancelButton.setTitle("Cancel", for: .normal)
        cancelButton.setTitleColor(UIColor.darkText, for: .normal)
        cancelButton.addTarget(self, action: #selector(cancel), for: .touchUpInside)
        return cancelButton
    }()
    
    public init(identifier: ExperienceIdentifier, store: ExperienceStore, viewControllerProvider: @escaping (Experience) -> UIViewController) {
        self.store = store
        self.identifier = identifier
        self.viewControllerProvider = viewControllerProvider
        super.init(nibName: nil, bundle: nil)
        configureView()
        layoutActivityIndicator()
        layoutCancelButton()
    }
    
    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    open override func viewDidLoad() {
        super.viewDidLoad()
        fetchExperience()
    }
    
    open func configureView() {
        view.backgroundColor = UIColor.white
    }
    
    open func layoutActivityIndicator() {
        view.addSubview(activityIndicator)
        
        if #available(iOS 11.0, *) {
            let layoutGuide = view.safeAreaLayoutGuide
            activityIndicator.centerXAnchor.constraint(equalTo: layoutGuide.centerXAnchor).isActive = true
            activityIndicator.centerYAnchor.constraint(equalTo: layoutGuide.centerYAnchor).isActive = true
        } else {
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor).isActive = true
        }
    }
    
    open func layoutCancelButton() {
        view.addSubview(cancelButton)
        
        cancelButton.centerXAnchor.constraint(equalTo: activityIndicator.centerXAnchor).isActive = true
        cancelButton.topAnchor.constraint(equalTo: activityIndicator.bottomAnchor, constant: 8).isActive = true
    }
    
    @objc open func cancel() {
        dismiss(animated: true, completion: nil)
    }
    
    open func fetchExperience() {
        startLoading()
        
        store.fetchExperience(for: identifier) { [weak self] result in
            
            // If the user cancels loading, the view controller may have been dismissed and garbage collected before the fetch completes
            
            guard let experienceContainer = self else {
                return
            }
            
            DispatchQueue.main.async {
                experienceContainer.stopLoading()
                
                switch result {
                case let .error(error, shouldRetry):
                    experienceContainer.present(error: error, shouldRetry: shouldRetry)
                case let .success(experience):
                    let viewController = experienceContainer.viewControllerProvider(experience)
                    experienceContainer.addChildViewController(viewController)
                    experienceContainer.view.addSubview(viewController.view)
                    viewController.didMove(toParentViewController: experienceContainer)
                    experienceContainer.setNeedsStatusBarAppearanceUpdate()
                }
            }
        }
    }
    
    var cancelButtonTimer: Timer?
    
    open func showCancelButton() {
        if let timer = cancelButtonTimer {
            timer.invalidate()
        }
        
        cancelButton.isHidden = true
        cancelButtonTimer = Timer.scheduledTimer(withTimeInterval: TimeInterval(3), repeats: false) { [weak self] _ in
            self?.cancelButtonTimer = nil
            self?.cancelButton.isHidden = false
        }
    }
    
    open func hideCancelButton() {
        if let timer = cancelButtonTimer {
            timer.invalidate()
        }
        
        cancelButton.isHidden = true
    }
    
    open func startLoading() {
        showCancelButton()
        activityIndicator.startAnimating()
    }
    
    open func stopLoading() {
        hideCancelButton()
        activityIndicator.stopAnimating()
    }
    
    open func present(error: Error?, shouldRetry: Bool) {
        let alertController: UIAlertController
        
        if shouldRetry {
            alertController = UIAlertController(title: "Error", message: "Failed to load experience", preferredStyle: UIAlertControllerStyle.alert)
            let cancel = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.cancel, handler: { _ in
                alertController.dismiss(animated: true, completion: nil)
                self.dismiss(animated: true, completion: nil)
            })
            let retry = UIAlertAction(title: "Try Again", style: UIAlertActionStyle.default, handler: { _ in
                alertController.dismiss(animated: true, completion: nil)
                self.fetchExperience()
            })
            alertController.addAction(cancel)
            alertController.addAction(retry)
        } else {
            alertController = UIAlertController(title: "Error", message: "Something went wrong", preferredStyle: UIAlertControllerStyle.alert)
            let ok = UIAlertAction(title: "Ok", style: UIAlertActionStyle.default, handler: { _ in
                alertController.dismiss(animated: false, completion: nil)
                self.dismiss(animated: true, completion: nil)
            })
            alertController.addAction(ok)
        }
        
        self.present(alertController, animated: true, completion: nil)
    }
}
