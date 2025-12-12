package com.ensta.myfilmlist.service;

import com.ensta.myfilmlist.dto.RealisateurDTO;
import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.form.RealisateurForm;

import java.util.List;

public interface RealisateurService {
    
    List<RealisateurDTO> getAllRealisateurs() throws ServiceException;

    RealisateurDTO getRealisateurById(long id) throws ServiceException;

    RealisateurDTO createRealisateur(RealisateurForm form) throws ServiceException;
}